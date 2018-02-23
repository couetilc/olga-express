#!/usr/bin/python
import sys
import argparse
import re
import os
import shutil

regex_rules = {
    '-mixed': 'mixedmedia/',
    '-water': 'watercolor/',
    '(^|-)ink': 'ink/',
    '(^|[ -])sket': 'sketchbook/'
}

def sortBucket(in_dir, out_dir, regex):
    cwd = os.getcwd()
    pic_names = os.listdir(cwd + in_dir)
    src_pics = [ os.path.normpath("/".join([cwd, in_dir, pic])) 
                    for pic in pic_names ]
    paths_to_copy = { 
        src_pics[key]: os.path.normpath("/".join([cwd, out_dir, dst]))
            for key, dst in enumerate(
                [ sortPicture(pic, regex) for pic in pic_names ])
    }

    for src, dst in paths_to_copy.iteritems():
        moveFile(src, dst)

def sortPicture(pic, rules):
    for rule, category in rules.iteritems():
        if re.search(rule, pic, re.IGNORECASE):
            return category + pic

def moveFile(src, dst):
    shutil.copyfile(src, dst)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Utility for organizing files from a given directory into distinct directories. Used to sort Olga\'s photos.')
    parser.add_argument('IN_DIR', 
                        action='store', 
                        nargs='?',
                        default='/bucket')
    parser.add_argument('OUT_DIR', 
                        action='store', 
                        nargs='?',
                        default='/processed')
    args = vars(parser.parse_args(sys.argv[1:]))
    sortBucket(args['IN_DIR'], args['OUT_DIR'], regex_rules);
